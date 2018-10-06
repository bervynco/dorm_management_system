<?php
class tenant_model extends CI_Model {
    function insertTenant($tenantDetail){
        $query = $this->db->insert('tenant', $tenantDetail);

        return $this->db->insert_id();
    }

    function selectAllTenantsPerBranch($branchId) {
        $this->db->select(array('tenant.*', 'room_tenant.*', 'room.branch_id'));
        $this->db->from('tenant');
        $this->db->join('room_tenant', 'room_tenant.room_tenant_id = tenant.room_tenant_id');
        $this->db->join('room', 'room_tenant.room_id = room.room_id');
        $this->db->where('room.branch_id', $branchId);
        $query = $this->db->get();

        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectTenant($tenantId) {
        $this->db->where('tenant_id', $tenantId)->get('tenant');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertPayment($payment) {
        $query = $this->db->insert('tenant_payment', $payment);

        return $this->db->insert_id();
    }

    function insertPaymentDetails($paymentDetails) {
        $query = $this->db->insert('tenant_payment_detail', $paymentDetails);

        return $this->db->insert_id();
    }
}

?>