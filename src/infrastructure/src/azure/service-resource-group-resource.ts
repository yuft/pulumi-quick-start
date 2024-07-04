import { ResourceGroup } from '@pulumi/azure-native/resources';

export class ServiceResourceGroupResource {
  resourceGroup: ResourceGroup;
  constructor() {
    this.resourceGroup = new ResourceGroup(`my-rg`, {
      location: 'EastUS',
      resourceGroupName: `my-rg`,
    });
  }
}
