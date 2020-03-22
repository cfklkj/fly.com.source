package kafka

import (
	"encoding/json"
	"time"

	"fly.com.imsub/util"
	"github.com/Shopify/sarama"
)

type Conn interface {
	Listen() error
	Send(topic string, key, value interface{}) error
	Close()
}

type kafka struct {
	con  sarama.AsyncProducer
	exit chan bool
}

func Connect(addrs []string) (Conn, error) {
	config := sarama.NewConfig()

	config.Producer.Return.Successes = true

	config.Net.DialTimeout = 5 * time.Second

	config.Producer.Partitioner = sarama.NewRandomPartitioner

	p, err := sarama.NewAsyncProducer(addrs, config)
	return &kafka{p, make(chan bool)}, err
}
func (c *kafka) Send(topic string, key, value interface{}) error {
	msg := &sarama.ProducerMessage{
		Topic: topic,
	}
	if key != nil {
		switch key.(type) {
		case string:
			msg.Key = sarama.ByteEncoder([]byte(key.(string)))
		default:
			keyB, _ := util.Encode(key)
			msg.Key = sarama.ByteEncoder(keyB)
		}
	}
	if value != nil {
		switch value.(type) {
		case []byte:
			msg.Value = sarama.ByteEncoder(value.([]byte))
		default:
			valueB, _ := json.Marshal(value) //直接发给客户端--用json
			msg.Value = sarama.ByteEncoder(valueB)
		}
	}
	//使用通道发送
	c.con.Input() <- msg
	return nil
}
func (c *kafka) Listen() error {
	for {
		select {
		case <-c.exit:
			return nil
		case err := <-c.con.Errors():
			return err
		case <-c.con.Successes():
		}
	}
}

func (c *kafka) Close() {
	c.exit <- true
}
