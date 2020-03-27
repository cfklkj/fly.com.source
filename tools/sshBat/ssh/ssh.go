package ssh

import (
	"errors"
	"net"
	"os"
	"path"
	"time"

	"github.com/pkg/sftp"
	gossh "golang.org/x/crypto/ssh"
)

type Conn interface {
	Cmd(arg []string) ([]byte, error)
	Run(shell string) ([]byte, error)
	SCPupFile(localFilePath, remoteDir string) error
	SCPDownFile(remoteFilePath, localDir string) error
}

type ssh struct {
	client *gossh.Client
}

func (c *ssh) Clear() {
	if c.client != nil {
		c.client.Close()
	}
}

func Connect(user, pwd, addr string) (Conn, error) {
	config := &gossh.ClientConfig{}
	config.SetDefaults()
	config.User = user
	config.Timeout = 5 * time.Second
	config.Auth = []gossh.AuthMethod{gossh.Password(pwd)}
	config.HostKeyCallback = func(hostname string, remote net.Addr, key gossh.PublicKey) error { return nil }
	client, err := gossh.Dial("tcp", addr, config)
	if err != nil {
		return nil, err
	}
	return &ssh{client}, nil
}

func (c *ssh) Run(shell string) ([]byte, error) {
	if c.client == nil {
		return nil, errors.New("client is nil")
	}
	session, err := c.client.NewSession()
	if err != nil {
		return nil, err
	}
	defer session.Close()
	return session.CombinedOutput(shell)
}

func (c *ssh) SCPupFile(localFilePath, remoteDir string) error {
	if c.client == nil {
		return errors.New("client is nil")
	}
	sftpClient, err := sftp.NewClient(c.client)
	if err != nil {
		return err
	}
	srcFile, err := os.Open(localFilePath)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	var remoteFileName = path.Base(localFilePath)
	dstFile, err := sftpClient.Create(path.Join(remoteDir, remoteFileName))
	if err != nil {
		return err
	}
	defer dstFile.Close()

	buf := make([]byte, 1024)
	for {
		n, _ := srcFile.Read(buf)
		if n == 0 {
			break
		}
		dstFile.Write(buf[0:n])
	}
	return nil
}

func (c *ssh) SCPDownFile(remoteFilePath, localDir string) error {
	if c.client == nil {
		return errors.New("client is nil")
	}
	sftpClient, err := sftp.NewClient(c.client)
	if err != nil {
		return err
	}

	srcFile, err := sftpClient.Open(remoteFilePath)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	var remoteFileName = path.Base(remoteFilePath)
	dstFile, err := os.Create(path.Join(localDir, remoteFileName))
	if err != nil {
		return err
	}
	defer dstFile.Close()

	buf := make([]byte, 1024)
	for {
		n, _ := srcFile.Read(buf)
		if n == 0 {
			break
		}
		dstFile.Write(buf[0:n])
	}
	return nil
}
