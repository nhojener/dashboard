<?php

class ModModel extends CI_Model {

    private $result = array();

    function __construct() {
        parent::__construct();
    }

    function fetch() {
        return $this->db->get('model');
    }

    function save($param) {
        $data = array(
            "name" => ($param["name"] != "" ? $param["name"] : null),
            "data" => ($param["data"] != "" ? $param["data"] : null)
        );

        if ($this->db->insert("model", $data)) {
            $this->result["success"] = true;
        } else {
            $this->result["success"] = false;
            $this->result["message"] = $this->db->_error_message();
        }

        return $this->result;
    }

    function delete($param) {
        $data = array(
            "id" => (array_key_exists("id", $param) ? $param["id"] : 0)
        );
        
        if ($this->db->delete('model', $data)) {
            $this->result["success"] = true;
        } else {
            $this->result["success"] = false;
            $this->result["message"] = $this->db->_error_message();
        }
        
        return $this->result;
    }

}
