<?php
class Service_model extends CI_Model {

    function getAllServices($branchId) {
        $query = $this->db->where('branch_id', $branchId)->get('room');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertNewService($service) {
        $query = $this->db->insert('service', $service);
        return $this->db->insert_id();
    }
}

?>