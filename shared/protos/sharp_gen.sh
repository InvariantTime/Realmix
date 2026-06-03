rm -rf ../../backend/Services/Realmix.Core/generated
mkdir ../../backend/Services/Realmix.Core/generated
protoc \
                                                   --proto_path=./ \
                                                   --csharp_out=../../backend/Services/Realmix.Core/generated \
                                                   ./*.proto
