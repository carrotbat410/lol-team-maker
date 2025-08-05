CREATE TABLE `users` (
`id` VARCHAR(20) NOT NULL COMMENT '유저 아이디',
`password` VARCHAR(64) NOT NULL COMMENT '해시된 비밀번호',
`created_at` DATETIME NOT NULL COMMENT '가입일',
PRIMARY KEY (`id`)
) COMMENT='유저 정보를 저장하는 테이블';

CREATE TABLE `friends` (
`no` INT NOT NULL AUTO_INCREMENT COMMENT '고유 번호',
`id` VARCHAR(20) NOT NULL COMMENT '유저 아이디 (users.id)',
`friend_nickname` VARCHAR(50) NOT NULL COMMENT '친구 소환사 이름',
`tagLine` VARCHAR(10) NOT NULL COMMENT '친구 태그 라인',
`created_at` DATETIME NOT NULL COMMENT '친구 추가일',
PRIMARY KEY (`no`),
UNIQUE KEY `UK_friends_id_nickname_tag` (`id`, `friend_nickname`, `tagLine`),
CONSTRAINT `FK_friends_users` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='유저별 친구 목록을 저장하는 테이블';

CREATE TABLE `summoner_sessions` (
`nickname` VARCHAR(50) NOT NULL COMMENT '소환사 이름',
`tagLine` VARCHAR(10) NOT NULL COMMENT '태그 라인',
`tier` VARCHAR(20) NULL COMMENT '티어 (e.g., GOLD, SILVER)',
`rank` VARCHAR(5) NULL COMMENT '랭크 (e.g., I, II, III, IV)',
`wins` INT NULL COMMENT '승리 횟수',
`losses` INT NULL COMMENT '패배 횟수',
`main_position` VARCHAR(10) NULL COMMENT '주 포지션',
`icon_id` INT NOT NULL COMMENT '프로필 아이콘 ID',
`level` INT NOT NULL COMMENT '소환사 레벨',
`mmr` INT NOT NULL DEFAULT 0 COMMENT '내부 MMR',
`created_at` DATETIME NOT NULL COMMENT '생성일',
`renewaled_at` DATETIME NOT NULL COMMENT '정보 갱신일',
PRIMARY KEY (`nickname`, `tagLine`)
) COMMENT='소환사 정보를 캐싱하여 저장하는 테이블';

CREATE TABLE `session_logs` (
`no` INT NOT NULL AUTO_INCREMENT COMMENT '고유 번호',
`ip` VARCHAR(50) NOT NULL COMMENT '접속 IP',
`message` VARCHAR(255) NULL COMMENT '로그 메시지',
`created_at` DATETIME NOT NULL COMMENT '접속 시간',
PRIMARY KEY (`no`)
) COMMENT='유저 접속 로그를 저장하는 테이블';