CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `dorm_management`.`user_view` AS
    SELECT 
        `dorm_management`.`user`.`user_id` AS `user_id`,
        `dorm_management`.`user`.`first_name` AS `first_name`,
        `dorm_management`.`user`.`last_name` AS `last_name`,
        `dorm_management`.`user`.`username` AS `username`,
        `dorm_management`.`user`.`mobile_number` AS `mobile_number`,
        `dorm_management`.`user_branch`.`user_branch_id` AS `user_branch_id`,
        `dorm_management`.`branch`.`branch_id` AS `branch_id`,
        `dorm_management`.`branch`.`branch_name` AS `branch_name`,
        `dorm_management`.`branch`.`branch_location` AS `branch_location`,
        `dorm_management`.`role`.`role` AS `role`,
        `dorm_management`.`role`.`role_id` as `role_id`
        
    FROM
        ((`dorm_management`.`user`
        JOIN `dorm_management`.`user_branch`)
        JOIN `dorm_management`.`branch`)
    WHERE
        (
			(`dorm_management`.`user`.`user_id` = `dorm_management`.`user_branch`.`user_id`)
		AND (`dorm_management`.`user_branch`.`branch_id` = `dorm_management`.`branch`.`branch_id`)
        AND (`dorm_management`.`user_branch`.`role.id` = `dorm_management`.`role`.`role_id`)
	)