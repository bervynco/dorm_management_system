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
        print_r($postData['branch_id']);
        $arrInventory = $this->inventory_model->selectAllInventoryPerBranch($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving inventory list", $arrInventory));
    }

    public function getAllInventoryTransaction(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrInventory = $this->inventory_model->selectAllInventoryTransactions($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving inventory list", $arrInventory));
    }
    
    public function getAllInventoryPerBranchPerRoom() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrInventory = $this->inventory_model->selectAllInventoryPerBranchPerRoom($postData['branch_id'], $postData['room_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving inventory list", $arrInventory));
    }

    public function getCurrentInventoryStock() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrInventory = $this->inventory_model->selectAllCurrentInventoryStock($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving inventory list", $arrInventory));
    }
    public function getInventoryNotAssigned() {

    }

    public function getAllInventoryPerTenant() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrInventory = $this->inventory_model->selectAllInventoryPerTenant($postData['branch_id'], $postData['tenant_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving inventory list", $arrInventory));
    }
    public function checkForDuplicateInventoryId($itemCode){
        $inventory = $this->inventory_model->checkDuplicateInventoryItem($itemCode);

        if(count($inventory) > 0){
            return true;
        }
        else {
            return false;
        }
    }

    public function updateInventoryTransactions() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $inventoryTransactionStatus = $this->inventory_model->updateInventoryTransactionItem($postData);

        if($inventoryTransactionStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully updated", $postData));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error updating"));
        }
    }
    public function addnewInventoryTransaction($inventoryId, $data) {
        $inventoryTransaction = array();
        $inventoryTransaction['inventory_id'] = $inventoryId;
        $inventoryTransaction['branch_id'] = $data['branch_id'];
        $inventoryTransaction['room_id'] = $data['room_id'];
        $inventoryTransaction['tenant_id'] = $data['tenant_id'];
        $inventoryTransaction['start_date'] = $data['start_date'];
        $inventoryTransaction['end_date'] = $data['end_date'];
        $inventoryTransaction['status'] = $data['status'];
        $inventoryTransaction['rent_amount'] = $data['rent_amount'];
        $inventoryTransaction['inventory_transaction_type'] = $data['inventory_transaction_type'];

        $inventoryTransactionId = $this->inventory_model->insertInventoryTransactionItem($inventoryTransaction);

    }
    public function addNewInventory(){
        $inventory = array();
        $postData = json_decode(file_get_contents('php://input'), true);
        $inventory['item_code'] = $postData['item_code'];
        $inventory['item_name'] = $postData['item_name'];
        $inventory['description'] = $postData['description'];
        $isDuplicate = $this->checkForDuplicateInventoryId($inventory['item_code']);
        if(!$isDuplicate) {
            $inventoryId = $this->inventory_model->insertInventoryItem($inventory);

            if($inventoryId > 0) {
                $this->addNewInventoryTransaction($inventoryId, $postData);
                echo json_encode($this->returnArray(200, "Successfully added new inventory item", $inventory));
                
            }
            else {
                echo json_encode($this->returnArray(500, "Error inserting new inventory item"));
            }
        }
        else {
            echo json_encode($this->returnArray(500, "Duplicate Item Code"));
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
        $inventoryStatus = $this->inventory_model->deleteInventoryItem($inventory['inventory_id'], $inventory['branch_id']);

        if($inventoryStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully deleted item", $inventory));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error deleting item"));
        }
    }

}
