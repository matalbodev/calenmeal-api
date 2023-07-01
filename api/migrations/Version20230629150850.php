<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230629150850 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE meal_in_calendar_id_seq CASCADE');
        $this->addSql('ALTER TABLE meal_in_calendar_meal DROP CONSTRAINT fk_bc478d7fcc19ffa8');
        $this->addSql('ALTER TABLE meal_in_calendar_meal DROP CONSTRAINT fk_bc478d7f639666d6');
        $this->addSql('DROP TABLE meal_in_calendar_meal');
        $this->addSql('DROP TABLE meal_in_calendar');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE meal_in_calendar_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE meal_in_calendar_meal (meal_in_calendar_id INT NOT NULL, meal_id INT NOT NULL, PRIMARY KEY(meal_in_calendar_id, meal_id))');
        $this->addSql('CREATE INDEX idx_bc478d7f639666d6 ON meal_in_calendar_meal (meal_id)');
        $this->addSql('CREATE INDEX idx_bc478d7fcc19ffa8 ON meal_in_calendar_meal (meal_in_calendar_id)');
        $this->addSql('CREATE TABLE meal_in_calendar (id INT NOT NULL, date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN meal_in_calendar.date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE meal_in_calendar_meal ADD CONSTRAINT fk_bc478d7fcc19ffa8 FOREIGN KEY (meal_in_calendar_id) REFERENCES meal_in_calendar (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE meal_in_calendar_meal ADD CONSTRAINT fk_bc478d7f639666d6 FOREIGN KEY (meal_id) REFERENCES meal (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
