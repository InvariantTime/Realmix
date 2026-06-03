rm -rf ../../frontend/packages/protocol/gen
mkdir ../../frontend/packages/protocol/gen
protoc \
                                                   --plugin=protoc-gen-ts_proto=../../frontend/node_modules/.bin/protoc-gen-ts_proto \
                                                   --ts_proto_out=../../frontend/packages/protocol/gen \
                                                   --proto_path=./ \
                                                   ./*.proto
