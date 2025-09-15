// import { ResourceGroup } from '@pulumi/azure-native/resources';
import * as azure from '@pulumi/azure-native';

export class ServiceResourceGroupResource {
  resourceGroup: azure.resources.ResourceGroup;
  constructor() {
    this.resourceGroup = new azure.resources.ResourceGroup(`my-rg`, {
      location: 'EastUS',
      resourceGroupName: `my-rg`,
    });
  }
}
