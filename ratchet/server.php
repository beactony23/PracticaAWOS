<?php
require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {

    protected $clients;
    protected $admins;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->admins = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        echo "Nueva conexión ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {

        $data = json_decode($msg);

        // Identificar tipo
        if ($data->tipo === "admin") {
            $this->admins->attach($from);
        } else if ($data->tipo === "cliente") {
            $this->clients->attach($from);
        }

        // Reenviar mensaje
        foreach ($this->clients as $client) {
            $client->send($msg);
        }

        foreach ($this->admins as $admin) {
            $admin->send($msg);
        }
    }

    public function onClose(ConnectionInterface $conn) {
        echo "Conexión {$conn->resourceId} cerrada\n";
        $this->clients->detach($conn);
        $this->admins->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }
}

$server = Ratchet\Server\IoServer::factory(
    new Ratchet\Http\HttpServer(
        new Ratchet\WebSocket\WsServer(
            new Chat()
        )
    ),
    8080
);

echo "Servidor WebSocket activo en ws://localhost:8080\n";
$server->run();