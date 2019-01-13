<?php
class utility_model extends CI_Model {
    function selectAllUtility($branchId) {
        $this->db->select(array('utility.utility_id' ,'utility.utility_name', 'utility.utility_description', 'utility.utility_amount', 'utility_branch.*'));
        $this->db->from('utility');
        $this->db->join('utility_branch', 'utility.utility_id = utility_branch.utility_id');
        $this->db->where('utility_branch.branch_id', $branchId);
        $this->db->where('utility_branch.status', "active");
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
                                'utility_description' => $utility['utility_description'],
                                'utility_amount' => $utility['utility_amount'],
                                'utility_recurrence' => $utility['utility_recurrence']
                            
                            )
        );
        return $this->db->affected_rows();
    }

    function deleteUtility($utilityId, $branchId){
        $query = $this->db->where('utility_id', $utilityId)
                        ->where('utility_id', $utilityId)
                        ->where('branch_id', $branchId)
                        ->update('utility_branch', 
                            array(
                                'status' => 'inactive'
                            )
        );
        return $this->db->affected_rows();
    }


    function checkDuplicateTenantUtility($utility){
        $query = $this->db->where('utility_id', $utility['utility_id'])
                ->where('tenant_id', $utility['tenant_id'])
                ->where('branch_id', $utility['branch_id'])
                ->where('status','active');
        
        $query = $this->db->get('utility_tenant');
        return $query->num_rows();

    }
    function insertUtilityTenant($utility){
        $query = $this->db->insert('utility_tenant', $utility);

        return $this->db->insert_id();
    }
}

?>