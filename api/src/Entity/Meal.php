<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\MealRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;



#[ORM\Entity(repositoryClass: MealRepository::class)]
#[ApiResource(
    description: 'Meals are the main part of the app. They are made of ingredients.',
    operations: [
        new Get(uriTemplate: '/meal/{id}'),
        new GetCollection(),
        new Post(),
        new Put(),
        new Delete(),
        new Patch()
    ],
    normalizationContext: ['groups' => ['meal:read']],
    denormalizationContext: ['groups' => ['meal:write']],
)]
class Meal
{
    public const MEAL_TIMES = [
        'breakfast',
        'lunch',
        'dinner',
        'snack',
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['meal:read', 'calendarMeal:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['meal:read', 'meal:write', 'calendarMeal:read', 'calendarMeal:write'])]
    private ?string $name = null;

    #[ORM\Column(type: 'string', length: 255, options: ['default' => 'breakfast'])]
    #[Assert\Choice(choices: self::MEAL_TIMES)]
    #[Groups(['meal:read', 'meal:write', 'calendarMeal:read', 'calendarMeal:write'])]
    private ?string $mealTime;

    #[ORM\ManyToMany(targetEntity: IngredientInMeal::class, inversedBy: 'meals', cascade: ['persist'])]
    #[Groups(['meal:read', 'meal:write', 'calendarMeal:write', 'calendarMeal:read'])]
    private Collection $ingredients;

    #[ORM\OneToMany(mappedBy: 'relatedMeal', targetEntity: CalendarMeal::class, orphanRemoval: true)]
    #[Groups(['meal:read', 'meal:write', 'calendarMeal:read', 'calendarMeal:write'])]
    private Collection $relatedCalendarMeal;

    public function __construct()
    {
        $this->ingredients = new ArrayCollection();
        $this->mealTime = 'breakfast';
        $this->relatedCalendarMeal = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, IngredientInMeal>
     */
    public function getIngredients(): Collection
    {
        return $this->ingredients;
    }

    public function addIngredient(IngredientInMeal $ingredient): static
    {
        if (!$this->ingredients->contains($ingredient)) {
            $this->ingredients->add($ingredient);
        }

        return $this;
    }

    public function removeIngredient(IngredientInMeal $ingredient): static
    {
        $this->ingredients->removeElement($ingredient);

        return $this;
    }


    public function getMealTime(): ?string
    {
        return $this->mealTime;
    }

    public function setMealTime(string $mealTime): static
    {
        $this->mealTime = $mealTime;

        return $this;
    }

    /**
     * @return Collection<int, CalendarMeal>
     */
    public function getRelatedCalendarMeal(): Collection
    {
        return $this->relatedCalendarMeal;
    }

    public function addRelatedCalendarMeal(CalendarMeal $relatedCalendarMeal): static
    {
        if (!$this->relatedCalendarMeal->contains($relatedCalendarMeal)) {
            $this->relatedCalendarMeal->add($relatedCalendarMeal);
            $relatedCalendarMeal->setRelatedMeal($this);
        }

        return $this;
    }

    public function removeRelatedCalendarMeal(CalendarMeal $relatedCalendarMeal): static
    {
        if ($this->relatedCalendarMeal->removeElement($relatedCalendarMeal)) {
            // set the owning side to null (unless already changed)
            if ($relatedCalendarMeal->getRelatedMeal() === $this) {
                $relatedCalendarMeal->setRelatedMeal(null);
            }
        }

        return $this;
    }
}
