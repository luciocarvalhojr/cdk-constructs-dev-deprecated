import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { NagSuppressions } from 'cdk-nag';

interface TmBastion extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class BastionStack extends cdk.Stack {
    public readonly securityGroupBastion: ec2.SecurityGroup;
    
    constructor(scope: Construct, id: string, props: TmBastion) {
      super(scope, id, props);

        this.securityGroupBastion = new ec2.SecurityGroup(this, 'BastionSecurityGroup', {
            vpc: props.vpc,
            allowAllOutbound: true,
            securityGroupName: 'bastion-security-group',
        });

        new ec2.BastionHostLinux(this, 'BastionHost', {
            vpc: props.vpc,
            instanceName: 'BastionHost',
            subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
            securityGroup: this.securityGroupBastion,
        });

    }
}

