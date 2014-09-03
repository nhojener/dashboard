<?php

class Model extends CI_Controller {

    private $model_dir;

    public function __construct() {
        parent::__construct();

        $this->model_dir = FCPATH . "resources/saved_models/";
        $this->load->model("ModModel");
    }

    public function load() {
        $models = array();
        $result = $this->ModModel->fetch()->result_array();

        foreach($result as $row){
            array_push($models, $row);
        }

        echo json_encode($models);
    }

    public function save() {
        $param = $this->input->post(NULL, TRUE);
        $result = $this->ModModel->save($param);
        echo json_encode($result);
    }
    
    public function delete() {
        $param = $this->input->get(NULL, TRUE);
        $result = $this->ModModel->delete($param);
        echo json_encode($result);
        
    }

}
