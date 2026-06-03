path=../../backend/Shared/Infrastructure/Realmix.Protos/Generated
rm -rf $path
mkdir $path
protoc \
                                                   --proto_path=./ \
                                                   --csharp_out=$path \
                                                   ./*.proto
