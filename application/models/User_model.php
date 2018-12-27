<?php
class user_model extends CI_Model {
    function checkUsername($username){
        $query = $this->db->where('username', $username)->get('user_details');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function login($username, $password){
        $query = $this->db->select(array('name', 'username', 'role'))->where('username', $username)->where('password', $password)->get('user');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectAllUsers($branchID){
        $query = $this->db->where('branch_id', $branchID)->get('user_details');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function checkExisting($action, $arrUserDetail){
        $query = $this->db->where('username', $arrUserDetail['username']);
        $query = $this->db->count_all_results('user');
        return $query;
    }
    function insertUser($arrUserDetail){
        $query = $this->db->insert('user', $arrUserDetail);

        return $this->db->insert_id();
    }
    
    function insertPassword($passwordObject) {
        $query = $this->db->insert('user_password', $passwordObject);

        return $this->db->insert_id();
    }
    function updateUser($arrUserDetail){
        $query = $this->db->where('id', $arrUserDetail['id'])
                          ->update('user', array('name'=> $arrUserDetail['name'], 'username' => $arrUserDetail['username'], 'role' => $arrUserDetail['role']));
        return $this->db->affected_rows();
    }

    function updatePassword($arrUserDetail){
        $query = $this->db->where('id', $arrUserDetail['id'])->update('user', array('password'=>$arrUserDetail['password']));

        return $this->db->affected_rows();
    }
    function deleteUser($arrUserDetail){
        $query = $this->db->where('id', $arrUserDetail['id'])->delete('user');

        return $this->db->affected_rows();
    }
}

?>