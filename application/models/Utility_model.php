<?php
class utility_model extends CI_Model {
    function selectAllUtility($branchId) {
        $this->db->select(array('utility.utility_id' ,'utility.utility_name', 'utility.utility_description'));
        $this->db->from('utility');
        $this->db->join('utility_branch', 'utility.utility_id = utility_branch.utility_id');
        $this->db->where('utility_branch.branch_id', $branchId);
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertUtility($utility) {
        $query = $this->db->insert('utility', $utility);

        return $this->db->insert_id();
    }

    function insertUtilityPerBranch($utility) {
        $query = $this->db->insert('utility_branch', $utility);

        return $this->db->insert_id();
    }

    function updateUtility($utility){
        $query = $this->db->where('utility_id', $utility['utility_id'])
                          ->update('utility', 
                            array(
                                'utility_name'=> $utility['utility_name'], 
                                'utility_description' => $utility['utility_description']
                            )
        );
        return $this->db->affected_rows();
    }
}

?>