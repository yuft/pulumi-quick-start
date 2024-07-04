import { K8sProvider } from './azure/k8s-provider';
import { ServiceResourceGroupResource } from './azure/service-resource-group-resource';

new ServiceResourceGroupResource().resourceGroup;

new K8sProvider();
