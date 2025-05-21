import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGamingMachineTable1684653600000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'gaming_machines',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'location',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'manufacturer',
            type: 'varchar',
          },
          {
            name: 'model',
            type: 'varchar',
          },
          {
            name: 'denominations',
            type: 'text',
            comment: 'Comma-separated list of denominations',
          },
          {
            name: 'game_types',
            type: 'text',
            comment: 'Comma-separated list of game types',
          },
          {
            name: 'pay_tables',
            type: 'text',
            comment: 'Comma-separated list of pay tables',
          },
          {
            name: 'player_limits',
            type: 'json',
          },
          {
            name: 'firmware_version',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'game_version',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        engine: 'InnoDB',
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('gaming_machines');
  }
}
