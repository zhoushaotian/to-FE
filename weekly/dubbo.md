# node调用dubbo服务
1. 使用node-zookeeper-client动态获取指定service的机器地址
2. 解析第一步中获取的地址信息，其中包含了服务ip，端口及方法等信息。
3. 使用hession编码待传输的数据，与dubbo服务建立socket连接，发送编码数据
4. 解码响应数据