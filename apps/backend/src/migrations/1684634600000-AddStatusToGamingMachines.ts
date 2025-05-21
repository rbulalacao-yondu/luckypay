import { MigrationInterface, QueryRunner } from 'typeorm';
import { MachineStatus } from '../admin/entities/machine-status.enum';

export class AddStatusToGamingMachines1684634600000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the enum type
    await queryRunner.query(`
      CREATE TYPE "machine_status_enum" AS ENUM (
        'In Play',
        'Idle',
        'Offline',
        'Out of Service',
        'Under Maintenance',
        'Fault Detected',
        'Reserved',
        'Testing Mode',
        'Cash Collection',
        'Jackpot Lockdown',
        'Security Lockdown',
        'Decommissioned'
      )
    `);

    // Add the status column with default value
    await queryRunner.query(`
      ALTER TABLE "gaming_machines"
      ADD COLUMN "status" "machine_status_enum" NOT NULL DEFAULT 'Idle'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the status column
    await queryRunner.query(`
      ALTER TABLE "gaming_machines"
      DROP COLUMN "status"
    `);

    // Drop the enum type
    await queryRunner.query(`
      DROP TYPE "machine_status_enum"
    `);
  }
}
