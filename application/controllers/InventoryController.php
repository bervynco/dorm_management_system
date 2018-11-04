<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class InventoryController extends CI_Controller {

	public function index()
	{
    
	}
    public function assignDataToArray($postData, $arrColumns){
        $insertArray = array();
        foreach($arrColumns as $col){
            $insertArray[$col] = (!empty($postData[$col])) ? $postData[$col] : null;
        }
        return $insertArray;
    }
    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
    
    public function getAllInventoryPerBranch(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrInventory = $this->inventory_model->selectAllInventoryPerBranch($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving inventory list", $arrInventory));
    }

    public function getAllInventoryPerBranchPerRoom() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrInventory = $this->inventory_model->selectAllInventoryPerBranchPerRoom($postData['branch_id'], $postData['room_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving inventory list", $arrInventory));
    }
    public function addNewInventory(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $inventory = $postData;
        $inventoryStatus = $this->inventory_model->insertInventoryItem($inventory);

        if($inventoryStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully added new item in a room", $inventory));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new item in a room"));
        }
    }
    
    public function editInventory() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $inventory = $postData;
        $inventoryStatus = $this->inventory_model->updateInventoryItem($inventory);

        if($inventoryStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully edited item in a room", $inventory));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error updating item in a room"));
        }
    }

    public function deleteInventory() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $inventory = $postData;
        $inventoryStatus = $this->inventory_model->deleteInventoryItem($inventory['inventory_id'], $inventory['room_id'], $inventory['branch_id']);

        if($inventoryStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully deleted item in a room", $inventory));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error deleting item in a room"));
        }
    }

}
