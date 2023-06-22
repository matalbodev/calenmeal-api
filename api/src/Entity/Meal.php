<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\MealRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;



#[ORM\Entity(repositoryClass: MealRepository::class)]
#[ApiResource(
    description: 'Meals are the main part of the app. They are made of ingredients.',
    operations: [
        new Get(uriTemplate: '/meal/{id}'),
        new GetCollection(),
        new Post(),
        new Put(),
        new Patch()
    ],
    normalizationContext: ['groups' => ['meal:read']],
    denormalizationContext: ['groups' => ['meal:write']],
)]
#[ApiFilter(DateFilter::class, strategy: DateFilter::EXCLUDE_NULL)]
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
    #[Groups(['meal:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['meal:read', 'meal:write'])]
    private ?string $name = null;

    #[ORM\Column(type: 'string', length: 255, options: ['default' => 'breakfast'])]
    #[Assert\Choice(choices: self::MEAL_TIMES)]
    #[Groups(['meal:read', 'meal:write'])]
    private ?string $mealTime;

    #[ORM\ManyToMany(targetEntity: IngredientInMeal::class, inversedBy: 'meals', cascade: ['persist'])]
    #[Groups(['meal:read', 'meal:write'])]
    private Collection $ingredients;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'], type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $date;

    public function __construct()
    {
        $this->ingredients = new ArrayCollection();
        $this->date = new \DateTimeImmutable();
        $this->mealTime = 'breakfast';
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

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;

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

    #[Groups(['meal:read'])]
    #[SerializedName('date')]
    public function getDateString(): ?string
    {
        return $this->date->format('Y-m-d');
    }
}
