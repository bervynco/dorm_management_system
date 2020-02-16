<?php
class inventory_model extends CI_Model {

    // function selectAllInventoryPerBranch($branchId) {
    //     $this->db->select(array('inventory.*', 'room.room_id', 'room.room_number'));
    //     $this->db->from('inventory');
    //     $this->db->join('room', 'room.room_id = inventory.room_id');
    //     $this->db->where('room.branch_id', $branchId);
    //     $this->db->where('inventory.status', "active");

    //     $query = $this->db->get();
    //     // $query = $this->db->where('branch_id', $branchId)->get('inventory');
    //     return ($query->num_rows() > 0) ? $query->result_array(): array();
    // }
    
    function checkDuplicateInventoryItem($itemCode) {
        $this->db->select("inventory.inventory_id");
        $this->db->from("inventory");
        $this->db->where('inventory.item_code', $itemCode);

        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectAllInventoryPerBranchPerRoom($branchId, $roomId){
        $this->db->select(array('inventory_transaction.*', 'inventory.*'));
        $this->db->from('inventory');
        $this->db->join('inventory_transaction', 'inventory.inventory_id = inventory_transaction.inventory_id', 'left');
        $this->db->where(array(
                'inventory.branch_id ='=> $branchId,
                'inventory_transaction.room_id ='=> $roomId,
                'inventory.status !='=> 'inactive',
                'inventory_transaction.inventory_transaction_type =' => 'room'
        ));
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function selectAllInventoryTransactions($branchId) {
        $this->db->select(array('inventory_transaction.*', 'inventory.*', 'room.room_id', 'room.room_number'));
        $this->db->from('inventory');
        $this->db->join('inventory_transaction', 'inventory.inventory_id = inventory_transaction.inventory_id', 'left');
        $this->db->join('room', 'room.room_id = inventory_transaction.room_id', 'left');
        $this->db->where(array(
                'inventory.branch_id ='=> $branchId,
                'inventory.status !='=> 'inactive'
        ));
        $this->db->where('inventory.branch_id', $branchId);
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    
    function selectAllInventoryPerTenant($branchId, $tenantId) {
        $this->db->select(array('inventory_transaction.*', 'inventory.*'));
        $this->db->from('inventory');
        $this->db->join('inventory_transaction', 'inventory.inventory_id = inventory_transaction.inventory_id', 'left');
        $this->db->where(array(
                'inventory.branch_id ='=> $branchId,
                'inventory_transaction.tenant_id ='=> $tenantId,
                'inventory.status !='=> 'inactive',
                'inventory_transaction.inventory_transaction_type =' => 'rent'
        ));
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function insertInventoryItem($inventory) {
        $query = $this->db->insert('inventory', $inventory);

        return $this->db->insert_id();
    }

    function updateInventoryTransactionItem($inventoryTransaction) {
        $query = $this->db->where('inventory_transaction_id', $inventoryTransaction['inventory_transaction_id'])
                          ->update('inventory_transaction', 
                            array(
                                'room_id' => $inventoryTransaction['room_id'],
                                'start_date' => $inventoryTransaction['start_date'],
                                'end_date' => $inventoryTransaction['end_date'],
                                'tenant_id' => $inventoryTransaction['tenant_id'],
                                'inventory_transaction_type' => $inventoryTransaction['inventory_transaction_type'],
                                'rent_amount' => $inventoryTransaction['rent_amount']
                            )
        );
        return $this->db->affected_rows();
    }

    function insertInventoryTransactionItem($inventoryTransaction) {
        $query = $this->db->insert('inventory_transaction', $inventoryTransaction);

        return $this->db->insert_id();
    }
    function updateInventoryItem($inventory) {
        $query = $this->db->where('inventory_id', $inventory['inventory_id'])
                          ->update('inventory', 
                            array(
                                'item_name'=> $inventory['item_name'], 
                                'item_code'=> $inventory['item_code'],
                                'description' => $inventory['description']
                            )
        );
        return $this->db->affected_rows();
    }
    function deleteInventoryItem($inventoryId, $branchId) {
        $query = $this->db->where('inventory_id', $inventoryId)
                        ->where('branch_id', $branchId)
                        ->update('inventory', 
                            array(
                                'status' => 'inactive'
                            )
        );
        return $this->db->affected_rows();
    }

    function deleteInventoryTransaction($inventoryTransactionId, $tenantId){
        $query = $this->db->where('inventory_transaction_id', $inventoryTransactionId)
                        ->where('tenant_id', $tenantId)
                        ->update('inventory_transaction', 
                            array(
                                'status' => 'inactive'
                            )
        );
        return $this->db->affected_rows();
    }
}

?>