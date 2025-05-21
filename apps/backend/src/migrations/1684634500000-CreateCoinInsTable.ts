import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCoinInsTable1684634500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'coin_ins',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'machineId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'gameType',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'machineBalance',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign keys with unique names
    await queryRunner.createForeignKey(
      'coin_ins',
      new TableForeignKey({
        name: 'FK_coin_ins_user_id_20250521',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'coin_ins',
      new TableForeignKey({
        name: 'FK_coin_ins_machine_id_20250521',
        columnNames: ['machineId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'gaming_machines',
        onDelete: 'CASCADE',
      }),
    );

    // Add indexes for better query performance
    await queryRunner.query(
      `CREATE INDEX idx_coin_ins_user_id ON coin_ins (userId)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_coin_ins_machine_id ON coin_ins (machineId)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_coin_ins_timestamp ON coin_ins (timestamp)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.query(`DROP INDEX idx_coin_ins_timestamp ON coin_ins`);
    await queryRunner.query(`DROP INDEX idx_coin_ins_machine_id ON coin_ins`);
    await queryRunner.query(`DROP INDEX idx_coin_ins_user_id ON coin_ins`);

    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE coin_ins DROP FOREIGN KEY FK_coin_ins_machine_id_20250521`,
    );
    await queryRunner.query(
      `ALTER TABLE coin_ins DROP FOREIGN KEY FK_coin_ins_user_id_20250521`,
    );

    // Drop the table
    await queryRunner.dropTable('coin_ins');
  }
}
