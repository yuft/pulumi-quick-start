import { listManagedClusterUserCredentialsOutput } from '@pulumi/azure-native/containerservice';
import { Provider } from '@pulumi/kubernetes';
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';
import { output } from '@pulumi/pulumi';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const execAsync = promisify(exec);

async function convertAndRunKubeLogin(kubeconfig: string) {
  const kubeConfigBytes = Buffer.from(kubeconfig, 'base64');
  const kubeConfig = kubeConfigBytes.toString('utf-8');
  const tempFile = join(tmpdir(), 'kubeconfig');
  await writeFileAsync(tempFile, kubeConfig);

  // https://azure.github.io/kubelogin/concepts/login-modes/workloadidentity.html
  const kubeLoginCommand = `kubelogin convert-kubeconfig -l workloadidentity`;

  await execAsync(kubeLoginCommand, {
    env: { KUBECONFIG: tempFile },
  });

  const content = await readFileAsync(tempFile, 'utf-8');
  return content;
}

export class K8sProvider {
  provider: Provider;
  providerNoServerSideApply: Provider;
  constructor() {
    const creds = listManagedClusterUserCredentialsOutput({
      resourceGroupName: `my-rg`,
      resourceName: `my-rg-aks`,
    });

    const encoded = creds.kubeconfigs[0].value;
    const kubeConfig = encoded.apply((x) => output(convertAndRunKubeLogin(x)));

    this.provider = new Provider('aks-provider', {
      kubeconfig: kubeConfig,
    });

    this.providerNoServerSideApply = new Provider('aks-provider-no-server-side-apply', {
      kubeconfig: kubeConfig,
      enableServerSideApply: false,
    });
  }
}
