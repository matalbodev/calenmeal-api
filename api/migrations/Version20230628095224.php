<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230628095224 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE meal_in_calendar_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE meal_in_calendar (id INT NOT NULL, date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN meal_in_calendar.date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE meal_in_calendar_meal (meal_in_calendar_id INT NOT NULL, meal_id INT NOT NULL, PRIMARY KEY(meal_in_calendar_id, meal_id))');
        $this->addSql('CREATE INDEX IDX_BC478D7FCC19FFA8 ON meal_in_calendar_meal (meal_in_calendar_id)');
        $this->addSql('CREATE INDEX IDX_BC478D7F639666D6 ON meal_in_calendar_meal (meal_id)');
        $this->addSql('ALTER TABLE meal_in_calendar_meal ADD CONSTRAINT FK_BC478D7FCC19FFA8 FOREIGN KEY (meal_in_calendar_id) REFERENCES meal_in_calendar (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE meal_in_calendar_meal ADD CONSTRAINT FK_BC478D7F639666D6 FOREIGN KEY (meal_id) REFERENCES meal (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE meal_in_calendar_id_seq CASCADE');
        $this->addSql('ALTER TABLE meal_in_calendar_meal DROP CONSTRAINT FK_BC478D7FCC19FFA8');
        $this->addSql('ALTER TABLE meal_in_calendar_meal DROP CONSTRAINT FK_BC478D7F639666D6');
        $this->addSql('DROP TABLE meal_in_calendar');
        $this->addSql('DROP TABLE meal_in_calendar_meal');
    }
}
