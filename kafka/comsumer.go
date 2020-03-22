package kafka

import (
	"errors"
	"time"

	"github.com/Shopify/sarama"
	cluster "github.com/bsm/sarama-cluster"
)

type ConsumerInfo func(topic string, key, value []byte)

//监听
func Consumer(addrs []string, groupID string, topics []string, callBack ConsumerInfo) error {
	//return c.ListenV2(groupID, topics, callBack)
	if callBack == nil {
		return errors.New("callback is nil")
	}
	config := cluster.NewConfig()
	config.Group.Return.Notifications = true
	config.Consumer.Offsets.CommitInterval = 1 * time.Second
	config.Consumer.Offsets.Initial = sarama.OffsetNewest //初始从最新的offset开始

	consumer, err := cluster.NewConsumer(addrs, groupID, topics, config)
	if err != nil {
		return err
	}

	errors := consumer.Errors()
	noti := consumer.Notifications()
	msgs := consumer.Messages()

	tick := time.NewTicker(1 * time.Second) //定时器
	defer tick.Stop()
	haveData := false
	for {
		select {
		case err := <-errors:
			if err != nil {
				return err
			}
		case <-noti:
		case msg, ok := <-msgs: //消息
			if !ok {
				continue
			}
			callBack(msg.Topic, msg.Key, msg.Value)
			haveData = true
			consumer.MarkOffset(msg, "") // mark message as processed
		case <-tick.C:
			if !haveData {
				continue
			}
			haveData = false
			err := consumer.CommitOffsets()
			if err != nil {
				return err
			}
		}
	}
}
