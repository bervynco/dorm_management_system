<?php
class inventory_model extends CI_Model {

    function selectAllInventoryPerBranch($branchId) {
        $this->db->select(array('inventory.*', 'room.room_id', 'room.room_number'));
        $this->db->from('inventory');
        $this->db->join('room', 'room.room_id = inventory.room_id');
        $this->db->where('room.branch_id', $branchId);

        $query = $this->db->get();
        // $query = $this->db->where('branch_id', $branchId)->get('inventory');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectAllInventoryPerBranchPerRoom($branchId, $roomId) {
        $this->db->select(array('inventory.*', 'room.room_id', 'room.room_number'));
        $this->db->from('inventory');
        $this->db->join('room', 'room.room_id = inventory.room_id');
        $this->db->where('room.branch_id', $branchId);
        $this->db->where('room.room_id', $roomId);

        $query = $this->db->get();
        // $query = $this->db->where('branch_id', $branchId)->get('inventory');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function insertInventoryItem($inventory) {
        $query = $this->db->insert('inventory', $inventory);

        return $this->db->insert_id();
    }

    function updateInventoryItem($inventory) {
        $query = $this->db->where('inventory_id', $inventory['inventory_id'])
                          ->update('inventory', 
                            array(
                                'item_name'=> $inventory['item_name'], 
                                'description' => $inventory['description'], 
                                'branch_id' => $inventory['branch_id'],
                                'room_id' => $inventory['room_id']
                            )
        );
        return $this->db->affected_rows();
    }
}

?>