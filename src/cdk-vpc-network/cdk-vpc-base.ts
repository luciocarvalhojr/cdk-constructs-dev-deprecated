import { CfnOutput } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';


/**
 * Represents the configuration for a VPC.
 */
export interface IVpcBase {
  /**
   * The CIDR block for the VPC.
   */
  readonly cidr: string;

  /**
   * The maximum number of availability zones to use for the VPC.
   */
  readonly maxAzs?: number;

  /**
   * The number of NAT gateways to create for the VPC.
   */
  readonly natGateways?: number;

  // Define any other properties you want to pass to the VPC construct
}

/**
 * A VPC construct that creates a VPC with public and private subnets.
 */
export class VpcBase extends Construct {
  /**
   * The VPC created by the construct.
   */
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: IVpcBase) {
    super(scope, id);

    // Create a VPC
    this.vpc = new ec2.Vpc(this, 'VpcBase', {
      // Default CIDR block for the VPC
      ipAddresses: ec2.IpAddresses.cidr(props.cidr),
      maxAzs: props.maxAzs, // Maximum availability zones
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC, // Public subnet
        },
        {
          cidrMask: 24,
          name: 'PrivateSubnetWithNat',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, // Private subnet
        },
        {
          cidrMask: 24,
          name: 'RDS',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED, // Private subnet
        },
      ],
      natGateways: props.natGateways !== undefined ? props.natGateways : 1, // Number of NAT gateways (for private subnets): props.natGateways | 1, // Number of NAT gateways (for private subnets)
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    function addGatewayEndpoint(service: string) {
      this.vpc.addGatewayEndpoint(`${service}Endpoint`, {
      service: ec2.GatewayVpcEndpointAwsService[service.toUpperCase()],
      });
      const endpointSecurityGroup = new ec2.SecurityGroup(this, `${service}EndpointSecurityGroup`, {
      vpc: this.vpc,
      });
      endpointSecurityGroup.addIngressRule(ec2.Peer.ipv4(this.vpc.vpcCidrBlock), ec2.Port.tcp(443));
    }

    // Add S3 endpoint by default. It is almost always useful and is free.
    addGatewayEndpoint('S3');
    // We don't always need DynamoDB endpoint, but it is free and can be useful.
    addGatewayEndpoint('DynamoDb');

    new CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      description: 'VPC ID',
    });
  }
}
