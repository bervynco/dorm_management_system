<?php
class tenant_model extends CI_Model {
    function insertTenant($tenantDetail){
        $query = $this->db->insert('tenant', $tenantDetail);

        return $this->db->insert_id();
    }

    function editTenant($tenantDetail){
        $query = $this->db->where('tenant_id', $tenantDetail['tenant_id'])
                          ->update('tenant', 
                            array(
                                'tenant_name' => $tenantDetail['tenant_name'],
                                'start_contract' => $tenantDetail['start_contract'],
                                'end_contract' => $tenantDetail['end_contract'],
                                'birthday' => $tenantDetail['birthday'],
                                'contact_number' => $tenantDetail['contact_number'],
                                'address' => $tenantDetail['address'],
                                'emergency_name' => $tenantDetail['emergency_name'],
                                'emergency_number' => $tenantDetail['emergency_number']
                            )
        );
        return $this->db->affected_rows();
    }
    function selectAllTenantsPerBranch($branchId) {
        $sql = "SELECT tenant.*, room_tenant.status as 'room_tenant_status' FROM tenant 
        LEFT JOIN room_tenant ON room_tenant.tenant_id = tenant.tenant_id 
        AND room_tenant.status = 'active' 
        LEFT JOIN room on room.room_id = room_tenant.room_id
        WHERE tenant.branch_id = $branchId AND tenant.status = 'active'";

        $query = $this->db->query($sql);
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectTenantPerId($tenantId){
        $sql = "SELECT tenant.*, room_tenant.status as 'room_tenant_status' FROM tenant 
        LEFT JOIN room_tenant ON room_tenant.tenant_id = tenant.tenant_id 
        AND room_tenant.status = 'active' 
        LEFT JOIN room on room.room_id = room_tenant.room_id
        WHERE tenant.tenant_id = $tenantId AND tenant.status = 'active'";

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

    function deleteTenantDeposit($tenantId, $branchId) {
        $query = $this->db->where('tenant_id', $tenantId)
                        ->where('status', 'active')
                        ->update('tenant_deposit', 
                            array(
                                'status' => 'inactive'
                            )
        );
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

    function getTenantPaymentHistory($tenantId){
        $query = $this->db->where('tenant_id', $tenantId)->where('status', 'encashed')->get('tenant_cheque');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertBillingPayment($payment){
        $query = $this->db->insert('billing_payment', $payment);
        return $this->db->insert_id();
    }

    function updateBillingData($billingDataId, $status){
        $query = $this->db->where('billing_data_id', $billingDataId)
                            ->update('billing_data', 
                            array(
                                'status' => $status
                            )
        );
        return $this->db->affected_rows();
    }

    function insertDeposit($payment) {
        $query = $this->db->insert('tenant_deposit', $payment);
        return $this->db->insert_id();
    }
}

?>