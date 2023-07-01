<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\IngredientInMealRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: IngredientInMealRepository::class)]
#[ApiResource(
    description: 'Ingredients in meals are the main part of the app. They are made of ingredients.',
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
        new Put(),
        new Patch()
    ],
    normalizationContext: ['groups' => ['ingredientInMeal:read']],
    denormalizationContext: ['groups' => ['ingredientInMeal:write']],
)]
class IngredientInMeal
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ingredientInMeal:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['ingredientInMeal:read', 'ingredientInMeal:write', 'meal:write', 'meal:read','calendarMeal:read', 'calendarMeal:write'])]
    private ?int $quantity = null;

    #[ORM\ManyToOne(inversedBy: 'ingredientInMeals')]
    #[Groups(['ingredientInMeal:read', 'meal:write', 'meal:read','calendarMeal:read', 'calendarMeal:write'])]
    private ?Ingredient $relation = null;

    #[ORM\ManyToMany(targetEntity: Meal::class, mappedBy: 'ingredients')]
    #[Groups(['ingredientInMeal:read'])]
    private Collection $meals;

    public function __construct()
    {
        $this->meals = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getRelation(): ?Ingredient
    {
        return $this->relation;
    }

    public function setRelation(?Ingredient $relation): static
    {
        $this->relation = $relation;

        return $this;
    }

    public function setIngredientAndQuantity(Ingredient $ingredient, int $quantity): static
    {
        $this->setRelation($ingredient);
        $this->setQuantity($quantity);

        return $this;
    }


    /**
     * @return Collection<int, Meal>
     */
    public function getMeals(): Collection
    {
        return $this->meals;
    }

    public function addMeal(Meal $meal): static
    {
        if (!$this->meals->contains($meal)) {
            $this->meals->add($meal);
            $meal->addIngredient($this);
        }

        return $this;
    }

    public function removeMeal(Meal $meal): static
    {
        if ($this->meals->removeElement($meal)) {
            $meal->removeIngredient($this);
        }

        return $this;
    }
}
