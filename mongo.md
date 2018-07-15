# mongodb学习笔记
## 概述
mongodb作为一个非关系型数据库，与mysql有很大区别。在mongodb中一个集合(collection)与mysql中的表很类似，其中一条数据为一个文档，在文档中使用BSON存储数据，即使用key-value的格式存储数据。  
mongodb不支持事务，只有原子性操作。这与mysql有很大不同。也就是说你不能保证一个文档数据的完整性。在一个文档中，会默认创建一个字段为_id的主键，这个值的类型是一个objectId类型，可由此值获取文档创建的时间。