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
        $this->db->select(array('tenant.*'));
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
}

?>