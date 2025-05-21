import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCashInsTable1684634400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the cash_ins table
    await queryRunner.createTable(
      new Table({
        name: 'cash_ins',
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
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'endingBalance',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'channel',
            type: 'enum',
            enum: ['gcash'],
          },
          {
            name: 'referenceId',
            type: 'varchar',
            length: '255',
            isNullable: true,
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

    // Add foreign key constraint with a unique name
    await queryRunner.createForeignKey(
      'cash_ins',
      new TableForeignKey({
        name: 'FK_cash_ins_user_id_20250521', // Added date to make it unique
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Add indexes for better query performance
    await queryRunner.query(
      `CREATE INDEX idx_cash_ins_user_id ON cash_ins (userId)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_cash_ins_timestamp ON cash_ins (timestamp)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_cash_ins_reference_id ON cash_ins (referenceId)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.query(`DROP INDEX idx_cash_ins_reference_id ON cash_ins`);
    await queryRunner.query(`DROP INDEX idx_cash_ins_timestamp ON cash_ins`);
    await queryRunner.query(`DROP INDEX idx_cash_ins_user_id ON cash_ins`);

    // Drop foreign key
    await queryRunner.query(
      `ALTER TABLE cash_ins DROP FOREIGN KEY FK_cash_ins_user_id_20250521`,
    );

    // Drop the table
    await queryRunner.dropTable('cash_ins');
  }
}
