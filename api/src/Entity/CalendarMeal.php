<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\CalendarMealRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CalendarMealRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => 'calendarMeal:read'],
    denormalizationContext: ['groups' => 'calendarMeal:write'],
)]
#[ApiFilter(DateFilter::class, strategy: DateFilter::EXCLUDE_NULL)]
class CalendarMeal
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['calendarMeal:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['calendarMeal:read', 'calendarMeal:write'])]
    private ?\DateTimeImmutable $date = null;

    #[ORM\ManyToOne(inversedBy: 'relatedCalendarMeal', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['calendarMeal:read', 'calendarMeal:write', 'meal:write', 'meal:read'])]
    private ?Meal $relatedMeal = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getRelatedMeal(): ?Meal
    {
        return $this->relatedMeal;
    }

    public function setRelatedMeal(?Meal $relatedMeal): static
    {
        $this->relatedMeal = $relatedMeal;

        return $this;
    }
}
