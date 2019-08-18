<?php
class payable_model extends CI_Model {
    function selectAllPayablePerBranch($branchId) {
        $query = $this->db->where('branch_id', $branchId)->where('status', 'active')->get('payables');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectAllPayablePerBranchWithDues($branchId, $previousWeek, $nextWeek) {
        $where = "(status='active' AND payable_date >='".$previousWeek."' AND payable_date <='".$nextWeek."') OR (status='active' AND payable_date <='".$previousWeek."')";
        $query = $this->db->where('branch_id', $branchId)->where($where)->get('payables');
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
    function deletePayableItem($payableId, $branchId, $status) {
        $query = $this->db->where('payable_id', $payableId)
                        ->update('payables', 
                        array(
                            'status' => $status
                        )
        );
        return $this->db->affected_rows();
    }

}

?>