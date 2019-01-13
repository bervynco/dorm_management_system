<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ServiceController extends CI_Controller {

	public function index()
	{
    
	}

    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
    
    public function getAllServices(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrTenants = $this->room_model->selectCountTenantPerRoomPerBranch($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving tenant list", $arrTenants));
    }

    public function addService() {
        $object = array();
        $postData = json_decode(file_get_contents('php://input'), true);

        $serviceId = $this->service_model->insertNewService($postData);

        if($serviceId != 0){
            echo json_encode($this->returnArray(200, "Successfully added new service"));
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new service"));
        }
    }

}
