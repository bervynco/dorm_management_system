<?php
class tenant_model extends CI_Model {
    function insertTenant($tenantDetail){
        $query = $this->db->insert('tenant', $tenantDetail);

        return $this->db->insert_id();
    }

    function selectAllTenantsPerBranch($branchId) {
        $sql = "SELECT tenant.*, room_tenant.status as 'room_tenant_status' FROM dorm_management.tenant 
        LEFT JOIN room_tenant ON room_tenant.tenant_id = tenant.tenant_id 
        AND room_tenant.status = 'active' 
        LEFT JOIN room on room.room_id = room_tenant.room_id
        WHERE tenant.branch_id = $branchId AND tenant.status = 'active'";

        $query = $this->db->query($sql);
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectTenant($tenantId) {
        $this->db->where('tenant_id', $tenantId)->where('status', "active")->get('tenant');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectAllChequePerTenant($tenantId){
        $this->db->where('tenant_id', $tenantId)->where('status', "active")->where('tenant_id', $tenantId);
        
        $query = $this->db->get('tenant_cheque');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    // function insertPayment($payment) {
    //     $query = $this->db->insert('tenant_payment', $payment);

    //     return $this->db->insert_id();
    // }

    // function insertPaymentDetails($paymentDetails) {
    //     $query = $this->db->insert('tenant_payment_detail', $paymentDetails);

    //     return $this->db->insert_id();
    // }

    function deleteTenant($tenantId, $branchId) {
        $query = $this->db->where('tenant_id', $tenantId)
                        ->where('branch_id', $branchId)
                        ->update('tenant', 
                            array(
                                'status' => 'inactive'
                            )
        );
        return $this->db->affected_rows();
    }

    function checkIfAssigned($tenantId){
        $query= $this->db->where('tenant_id', $tenantId)->where('status', 'active')->get('room_tenant');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function inserRoomTenant($tenantId, $roomId) {
        $data['tenant_id'] = $tenantId;
        $data['room_id'] = $roomId;
        $query = $this->db->insert('room_tenant', $data);

        return $this->db->insert_id();
    }

    function deleteRoomTenant($roomTenantId, $status){
        $query = $this->db->where('room_tenant_id', $roomTenantId)
                        ->update('room_tenant', 
                            array(
                                'status' => $status
                            )
        );
        return $this->db->affected_rows();
    }
}

?>