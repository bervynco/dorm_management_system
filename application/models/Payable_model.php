<?php
class payable_model extends CI_Model {
    function selectAllPayablePerBranch($branchId) {
        $query = $this->db->where('branch_id', $branchId)->get('payables');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertPayableItem($payables) {
        $query = $this->db->insert('payables', $payables);

        return $this->db->insert_id();
    }

     function updatePayableItem($payables) {
        $query = $this->db->where('payable_id', $payables['payable_id'])
                          ->update('payables', 
                            array(
                                'name'=> $payables['name'], 
                                'description' => $payables['description'],
                                'payable_date' => $payables['payable_date'], 
                                'amount' => $payables['amount'], 
                                'branch_id' => $payables['branch_id']
                            )
        );
        return $this->db->affected_rows();
    }
}

?>