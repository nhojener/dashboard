<?php

class Arduino extends CI_Controller {

    var $URL = "http://192.168.240.2/";
    var $PIN = array(
        "D2" => 2,
        "D3" => 3,
        "D4" => 4,
        "D5" => 5,
        "D6" => 6,
        "D7" => 7,
        "D8" => 8,
        "D9" => 9,
        "D10" => 10,
        "D11" => 11,
        "D12" => 12,
        "D13" => 13
    );

    public function index() {
        $param = $this->input->get(NULL, TRUE);
        $result = NULL;

        if ($param != NULL && array_key_exists("pin", $param) && array_key_exists("cmd", $param)) {
            if (array_key_exists($param["pin"], $this->PIN)) {
                if ($param["cmd"] != "" || $param["cmd"] == 0 || $param["cmd"] == 1) {
                    $curl = curl_init();

                    curl_setopt($curl, CURLOPT_URL, $this->URL . "arduino/digital/" . $this->PIN[$param["pin"]] . "/" . $param["cmd"]);
                    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

                    $result = curl_exec($curl);
                    curl_close($curl);
                } else {
                    echo "Invalid cmd value!";
                }
            } else {
                echo "Undefined pin " . $param["pin"] . "!";
            }
        } else {
            echo "Invalid parameter!";
        }

        echo $result;
    }

    public function read() {
        $param = $this->input->get(NULL, TRUE);
        $pins = array();
        $data = array();

        if ($param != NULL && array_key_exists("pin", $param) && $param["pin"] == "*") {
            $pins = array_values($this->PIN);
        } else if ($param != NULL && array_key_exists("pin", $param)) {
            $array_of_pin = explode(",", $param["pin"]);

            foreach ($array_of_pin as $pin) {
                if (array_key_exists($pin, $this->PIN)) {
                    array_push($pins, $this->PIN[$pin]);
                }
            }
        } else {
            echo "Invalid parameter!";
        }

        foreach ($pins as $pin) {
            $curl_result = NULL;

            $curl = curl_init();

            curl_setopt($curl, CURLOPT_URL, $this->URL . "arduino/digital/" . $pin);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            $curl_result = curl_exec($curl);
            curl_close($curl);

            $curl_result = json_decode($curl_result, TRUE);

            array_push($data, array("pin" => $curl_result["pin"], "value" => $curl_result["value"]));
        }

        echo json_encode($data);
    }

}
