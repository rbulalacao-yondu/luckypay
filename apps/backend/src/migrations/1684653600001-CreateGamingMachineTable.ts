import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGamingMachineTable1684653600000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE gaming_machines (
        id VARCHAR(36) PRIMARY KEY,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        manufacturer VARCHAR(255) NOT NULL,
        model VARCHAR(255) NOT NULL,
        denominations TEXT NOT NULL COMMENT 'Comma-separated list of denominations',
        game_types TEXT NOT NULL COMMENT 'Comma-separated list of game types',
        pay_tables TEXT NOT NULL COMMENT 'Comma-separated list of pay tables',
        player_limits JSON NOT NULL,
        firmware_version VARCHAR(50) NOT NULL,
        game_version VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS gaming_machines');
  }
}
