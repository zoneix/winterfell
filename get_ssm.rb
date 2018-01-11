require 'aws-sdk'

client = Aws::SSM::Client.new(region: 'us-east-1')
resp = client.get_parameters({
  names: ["SparkOAuthClientID", "SparkOAuthClientSecret"], # required
  with_decryption: true,
})

oauthclientid = resp.parameters[0].value
oauthclientsecret = resp.parameters[1].value
 
file_names = ['config.json']

file_names.each do |file_name|
  text = File.read(file_name)

  # Display text for usability
  puts text


  # Substitute Variables
  new_contents = text.gsub(/ClientIDSSMVal/, oauthclientid)
  new_contents = new_contents.gsub(/ClientSecretSSMVal/, oauthclientsecret)


  # To write changes to the file, use:
  File.open(file_name, "w") {|file| file.puts new_contents.to_s }
end
