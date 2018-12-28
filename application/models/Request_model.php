<?php
class request_model extends CI_Model {
    function selectAllRequest  ($branchId) {
        $query = $this->db->where('branch_id', $branchId)->get('calendar');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertNewRequest($request) {
        $query = $this->db->insert('approval_request', $request);

        return $this->db->insert_id();
    }
}

?>