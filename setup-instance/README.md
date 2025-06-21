# How to setup the instance

1. Create a Terraform variable file `setup-instance/terraform.tfvars` with the following content:

   ```hcl
   # Instance name
   instance_name = "<YOUR_INSTANCE_NAME>"
   ```

2. Run Terraform

   ```sh
   cd setup-instance
   terraform init
   terraform apply
   ```

3. Create a GH Personal Access Token and save it to a file named `token`

4. Copy setup, update scripts and token file to the instance

   ```sh
   cd setup-instance
   gcloud compute scp setup.sh update.sh token <YOUR_INSTANCE_NAME>:
   ```

5. Execute setup script

   ```sh
   gcloud compute ssh <YOUR_INSTANCE_NAME> --command "./setup.sh"
   ```
