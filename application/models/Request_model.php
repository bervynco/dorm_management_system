<?php
class request_model extends CI_Model {
    function selectAllRequest ($branchId) {
        $this->db->select(array('approval_request.*', 'user.name'));
        $this->db->from('approval_request');
        $this->db->join('user', 'approval_request.user_id = user.user_id');
        $this->db->where('approval_request.branch_id', $branchId);
        $this->db->where('approval_request.status', "active");

        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertNewRequest($request) {
        $query = $this->db->insert('approval_request', $request);

        return $this->db->insert_id();
    }

    function editApprovalRequest($request) {
        $query = $this->db->where('approval_request_id', $request['approval_request_id'])
                          ->update('approval_request', 
                            array(
                                'status'=> $request['status']
                            )
        );
        return $this->db->affected_rows();
    }
}

?>