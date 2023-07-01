<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230629152514 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE calendar_meal_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE calendar_meal (id INT NOT NULL, related_meal_id INT NOT NULL, date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_CC600DC85C8FAC73 ON calendar_meal (related_meal_id)');
        $this->addSql('COMMENT ON COLUMN calendar_meal.date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE calendar_meal ADD CONSTRAINT FK_CC600DC85C8FAC73 FOREIGN KEY (related_meal_id) REFERENCES meal (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE calendar_meal_id_seq CASCADE');
        $this->addSql('ALTER TABLE calendar_meal DROP CONSTRAINT FK_CC600DC85C8FAC73');
        $this->addSql('DROP TABLE calendar_meal');
    }
}
