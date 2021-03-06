<?php
class room_model extends CI_Model {
    function insertRoom($roomDetail){
        $query = $this->db->insert('room', $roomDetail);

        return $this->db->insert_id();
    }

    function selectAllRoomsPerBranch($branchId) {

        $query = $this->db->where('branch_id', $branchId)->get('room');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectTenantPerRoom($branchId, $roomId){
        $this->db->select(array('tenant.*', 'room_tenant.room_tenant_id'));
        $this->db->from('tenant');
        $this->db->join('room_tenant', 'room_tenant.tenant_id = tenant.tenant_id');
        $this->db->join('room', 'room_tenant.room_id = room.room_id');
        $this->db->where('room.branch_id', $branchId);
        $this->db->where('room.room_id', $roomId);
        $this->db->where('tenant.status', "active");
        $this->db->where('room_tenant.status', "active");
        $query = $this->db->get();

        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectTenantPerRoomPerBranchSummary($branchId){
        $this->db->select(array('tenant.*', 'room_tenant.*', 'room.branch_id'));
        $this->db->from('tenant');
        $this->db->join('room_tenant', 'room_tenant.tenant_id = tenant.tenant_id');
        $this->db->join('room', 'room_tenant.room_id = room.room_id');
        $this->db->where('room.branch_id', $branchId);
        $this->db->where('tenant.status', "active");
        $this->db->where('room_tenant.status', "active");
        $query = $this->db->get();

        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectCountTenantPerRoomPerBranch($branchId) {
        $string = "SELECT a.*, COUNT(b.room_tenant_id) as 'tenant_count' FROM room a left join room_tenant b 
          ON a.room_id = b.room_id AND b.status = 'active' WHERE a.branch_id = $branchId GROUP BY a.room_number";

        $query = $this->db->query($string);
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectTenantsWithNoRoom($branchId) {
        $string = "SELECT a.*, b.* FROM tenant a LEFT OUTER JOIN room_tenant b ON (a.room_tenant_id = b.room_tenant_id)
                    WHERE b.room_tenant_id IS NULL";
        
        $query = $this->db->query($string);
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertNewRoomTenant($roomDetail){
        $query = $this->db->insert('room_tenant', $roomDetail);

        return $this->db->insert_id();
    }

    function updateRoomTenant($tenantId, $roomTenantId) {
        $this->db->set('room_tenant_id', $roomTenantId);
        $this->db->where('tenant_id', $tenantId);
        $this->db->update('tenant');
        $this->db->trans_complete();

        return $this->db->affected_rows();
    }

    function selectTenantChequesPerRoom($roomId) {
        //$sql = "SELECT room.room_id as 'Room Id', room_tenant.room_tenant_id as 'Room Tenant Id', tenant.tenant_id, tenant.tenant_name as 'Name',tenant_cheque.* FROM room LEFT JOIN room_tenant on room_tenant.room_id = room.room_id AND status='active' LEFT JOIN tenant_cheque on room_tenant.tenant_id = tenant_cheque.tenant_id AND tenant_cheque.status='active' LEFT JOiN tenant ON tenant.tenant_id = room_tenant.tenant_id Where room.room_id=".$roomId."";
        $sql = "SELECT room.room_id as 'Room Id', room_tenant.room_tenant_id as 'Room Tenant Id', tenant.tenant_id, tenant.branch_id, tenant.tenant_name as 'Name',tenant_cheque.tenant_cheque_id, tenant_cheque.cheque_bank, tenant_cheque.cheque_number, tenant_cheque.cheque_amount, tenant_cheque.cheque_date FROM room LEFT JOIN room_tenant on room_tenant.room_id = room.room_id AND status='active' LEFT JOiN tenant ON tenant.tenant_id = room_tenant.tenant_id LEFT JOIN tenant_cheque on room_tenant.tenant_id = tenant_cheque.tenant_id AND tenant_cheque.status='active'  Where room.room_id=".$roomId."";
        $query = $this->db->query($sql);
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    
    }

    function insertPaymentPerTenant($payment){
        $query = $this->db->insert('room_tenant_payment', $payment);

        return $this->db->insert_id();
    }

    function getRentPaymentForApproval($branchId) {
        $this->db->select(array('room_tenant_payment.room_tenant_payment_id', 'tenant.tenant_id', 'tenant.tenant_name', 'room.branch_id', 'room_tenant_payment.amount', 'payment.payment_name', 
        'room.room_number', 'tenant_cheque.tenant_cheque_id', 'tenant_cheque.cheque_bank', 'tenant_cheque.cheque_number', 'tenant_cheque.cheque_date'));
        $this->db->from('room_tenant_payment');
        $this->db->where('room_tenant_payment.status', "approval");
        $this->db->join('room_tenant', 'room_tenant.room_tenant_id = room_tenant_payment.room_tenant_id');
        $this->db->join('tenant_cheque', 'room_tenant_payment.tenant_cheque_id = tenant_cheque.tenant_cheque_id','left');
        $this->db->join('room', 'room_tenant.room_id = room.room_id');
        $this->db->join('tenant', 'room_tenant.tenant_id = tenant.tenant_id');
        $this->db->join('payment', 'room_tenant_payment.payment_id = payment.payment_id');
        $this->db->where('room.branch_id', $branchId);

        $query = $this->db->get();

        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function updateRoomPaymentStatus($roomPaymentId, $status) {
        $query = $this->db->where('room_tenant_payment_id', $roomPaymentId)
                        ->update('room_tenant_payment', 
                        array(
                            'status' => $status
                        )
        );
        return $this->db->affected_rows();
    }

    function updateRoomTenantStatus($tenantId) {
        $query = $this->db->where('tenant_id', $tenantId)
                        ->update('tenant', 
                            array(
                                'status' => 'inactive'
                            )
        );
        return $this->db->affected_rows();
    }
}

?>