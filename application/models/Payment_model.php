<?php
class payment_model extends CI_Model {
    function selectPaymentTypes() {
        $query = $this->db->get('payment');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectChequePayment($branchId) {
        $this->db->select(array('tenant.tenant_id', 'tenant.tenant_name', 'tenant_cheque.*'));
        $this->db->from('tenant_cheque');
        $this->db->join('tenant', 'tenant_cheque.tenant_id = tenant.tenant_id');
        $this->db->where('tenant_cheque.status', "active");
        $this->db->where('tenant_cheque.branch_id', $branchId);
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertCheques($payment) {
        $query = $this->db->insert('tenant_cheque', $payment);

        return $this->db->insert_id();
    }

    function deletePaymentItem($tenantChequeId, $branchId, $statusMessage = null) {
        $query = $this->db->where('tenant_cheque_id', $tenantChequeId)
                        ->where('branch_id', $branchId)
                        ->update('tenant_cheque', 
                        array(
                            'status' => $statusMessage
                        )
        );
        return $this->db->affected_rows();
    }

    
}

?>

