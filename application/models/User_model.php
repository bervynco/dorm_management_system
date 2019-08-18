<?php
class user_model extends CI_Model {
    function checkUsername($username){
        $sql = "SELECT 
        `user`.`user_id` AS `user_id`,
        `user`.`name` AS `name`,
        `user`.`username` AS `username`,
        `user`.`mobile_number` AS `mobile_number`,
        `user_branch`.`user_branch_id` AS `user_branch_id`,
        `branch`.`branch_id` AS `branch_id`,
        `branch`.`branch_name` AS `branch_name`,
        `branch`.`branch_location` AS `branch_location`,
        `role`.`role` AS `role`,
        `role`.`role_id` AS `role_id`
    FROM
        (((`user`
        JOIN `user_branch`)
        JOIN `branch`)
        JOIN `role`)
    WHERE
        ((`user`.`user_id` = `user_branch`.`user_id`)
            AND (`user_branch`.`branch_id` = `branch`.`branch_id`)
            AND (`role`.`role_id` = `user_branch`.`role_id`)
            AND (`user`.`active_flag` = 1)
            AND (`user`.`username` = '".$username."'))";
        $query = $this->db->query($sql);
        // $query = $this->db->where('username', $username)->get('user_details');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function login($username, $password){
        $query = $this->db->select(array('name', 'username', 'role'))->where('username', $username)->where('password', $password)->get('user');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectAllUsers($branchID){
        $sql = "SELECT 
        `user`.`user_id` AS `user_id`,
        `user`.`name` AS `name`,
        `user`.`username` AS `username`,
        `user`.`mobile_number` AS `mobile_number`,
        `user_branch`.`user_branch_id` AS `user_branch_id`,
        `branch`.`branch_id` AS `branch_id`,
        `branch`.`branch_name` AS `branch_name`,
        `branch`.`branch_location` AS `branch_location`,
        `role`.`role` AS `role`,
        `role`.`role_id` AS `role_id`
    FROM
        (((`user`
        JOIN `user_branch`)
        JOIN `branch`)
        JOIN `role`)
    WHERE
        ((`user`.`user_id` = `user_branch`.`user_id`)
            AND (`user_branch`.`branch_id` = `branch`.`branch_id`)
            AND (`role`.`role_id` = `user_branch`.`role_id`)
            AND (`user`.`active_flag` = 1)
            AND (`user_branch`.`branch_id` = ".$branchID."))";
        $query = $this->db->query($sql);
        // $query = $this->db->where('branch_id', $branchID)->get('user_details');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectAllRoles(){
        $query = $this->db->get('role');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function checkExisting($action, $arrUserDetail){
        $query = $this->db->where('username', $arrUserDetail['username'])->where('active_flag', 1);
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
        $query = $this->db->where('user_id', $arrUserDetail['user_id'])
                          ->update('user', array('name'=> $arrUserDetail['name'], 'mobile_number' => $arrUserDetail['mobile_number']));
        return $this->db->affected_rows();
    }

    function updateRole($arrUserDetail){
        $query = $this->db->where('user_branch_id', $arrUserDetail['user_branch_id'])
                          ->update('user_branch', array('role_id'=> $arrUserDetail['role']['role_id']));
        return $this->db->affected_rows();
    }
    function updatePassword($arrUserDetail){
        $query = $this->db->where('id', $arrUserDetail['id'])->update('user', array('password'=>$arrUserDetail['password']));

        return $this->db->affected_rows();
    }
    function deleteUser($arrUserDetail){
        $query = $this->db->where('user_id', $arrUserDetail['user_id'])->update('user', array('active_flag' => 0));

        return $this->db->affected_rows();
    }

    function insertUserToBranch($arrUserDetail) {
        $query = $this->db->insert('user_branch', $arrUserDetail);

        return $this->db->insert_id();
    }

    function getPassword($userId){
        $query = $this->db->select(array('password'))->where('user_id', $userId)->get('user_password');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
}

?>