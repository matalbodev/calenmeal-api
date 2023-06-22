<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\IngredientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: IngredientRepository::class)]
#[ApiResource(
    description: "These are the ingredients for meals",
    normalizationContext: ['groups' => ['ingredient:read']],
    denormalizationContext: ['groups' => ['ingredient:write']],
)]
class Ingredient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ingredient:read', 'ingredientInMeal:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['ingredient:read', 'ingredient:write', 'ingredientInMeal:read', 'meal:read'])]
    private ?string $name = null;

    /**
     * Represents calories per 100g
     */
    #[ORM\Column]
    #[Groups(['ingredient:read', 'ingredient:write', 'ingredientInMeal:read', 'meal:read'])]
    private int $calories;

    #[ORM\OneToMany(mappedBy: 'relation', targetEntity: IngredientInMeal::class)]
    #[Groups(['ingrdientInMeal:read'])]
    private Collection $ingredientInMeals;

    public function __construct()
    {
        $this->ingredientInMeals = new ArrayCollection();
        $this->calories = 0;
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

    public function getCalories(): ?int
    {
        return $this->calories;
    }

    public function setCalories(int $calories): static
    {
        $this->calories = $calories;

        return $this;
    }

    /**
     * @return Collection<int, IngredientInMeal>
     */
    public function getIngredientInMeals(): Collection
    {
        return $this->ingredientInMeals;
    }

    public function addIngredientInMeal(IngredientInMeal $ingredientInMeal): static
    {
        if (!$this->ingredientInMeals->contains($ingredientInMeal)) {
            $this->ingredientInMeals->add($ingredientInMeal);
            $ingredientInMeal->setRelation($this);
        }

        return $this;
    }

    public function removeIngredientInMeal(IngredientInMeal $ingredientInMeal): static
    {
        if ($this->ingredientInMeals->removeElement($ingredientInMeal)) {
            // set the owning side to null (unless already changed)
            if ($ingredientInMeal->getRelation() === $this) {
                $ingredientInMeal->setRelation(null);
            }
        }

        return $this;
    }
}
